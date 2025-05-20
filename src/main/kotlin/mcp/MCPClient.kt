package org.example.mcp

import io.ktor.client.*
import io.ktor.http.*
import io.modelcontextprotocol.kotlin.sdk.Implementation
import io.modelcontextprotocol.kotlin.sdk.TextContent
import io.modelcontextprotocol.kotlin.sdk.client.Client
import io.modelcontextprotocol.kotlin.sdk.client.SseClientTransport
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.example.mcp.model.*
import org.example.util.copyChatMessage
import java.util.concurrent.TimeUnit

class MCPClient : AutoCloseable {
    private val sseConfig = HttpClient {
        install(io.ktor.client.plugins.sse.SSE) {
            // 可配置SSE插件
        }
    }

    private val transport = SseClientTransport(
        client = sseConfig,
        urlString = "http://127.0.0.1:3001",
        requestBuilder = {
            headers.apply {
                append(HttpHeaders.Accept, "text/event-stream")
                append(HttpHeaders.CacheControl, "no-cache")
                // 可添加认证头
            }
        }
    )

    // Initialize MCP client
    private val mcp: Client = Client(clientInfo = Implementation(name = "mcp-client-cli", version = "1.0.0"))

    // List of tools offered by the server
    private lateinit var tools: List<Tool>

    private val json = Json { ignoreUnknownKeys = true }

    override fun close() {
        runBlocking {
            mcp.close()
        }
    }

    // Connect to the server using the path to the server
    suspend fun connectToServer() {
        discoverTools()
//        executeConversation("412478720的信息")
    }

    suspend fun discoverTools() {
        // Connect the MCP client to the server using the transport
        mcp.connect(transport)

        // Request the list of available tools from the server
        tools = mcp.listTools()?.tools?.map { tool ->
            val toolParameters = ToolParameters(
                type = "object",
                properties = json.decodeFromString<Map<String, Property>>(tool.inputSchema.properties.toString()),
                required = tool.inputSchema.required ?: emptyList()
            )

            Tool("function", ToolFunction(tool.name, tool.description ?: "", toolParameters))
        } ?: emptyList()

    }

    /**
     * Executes a conversation with the server using the provided query.
     *
     * @param query The query to send to the server.
     */
    suspend fun executeConversation(query: String): Flow<String> = flow {
        val messages = mutableListOf(
            Message(role = "system", content = """
                你是一个粉丝网站AI助手，用户会询问你关于音乐组合tayori（成员包括主唱isui（倚水），编曲作词raku、tazuneru）的相关问题。
                你可以通过调用提供的工具获取相关信息。
                语气要求亲切自然。
            """.trimIndent()),
            Message(role = "user", content = query)
        )

//        while (true) {
//            val response = sendMessages(messages, tools)
//
//            val assistantMsg = response.choices.first().message
//            emit(json.encodeToString(assistantMsg))
//            messages.add(assistantMsg)
//
//            assistantMsg.tool_calls?.forEach { call ->
//                val result = mcp.callTool(call.function.name, call.function.arguments.jsonToMap())?.content
//                    ?.joinToString("\n") { (it as? TextContent)?.text ?: "" }
//                    ?: ""
//
//                messages.add(Message(
//                    role = "tool",
//                    content = result,
//                    tool_call_id = call.id
//                ))
//                emit(json.encodeToString(messages.last()))
//            } ?: break
//        }
        while (true) {
            val responseFlow = streamMessages(messages, tools)

            val deltaMessage = Message()

            responseFlow.collect { part ->
                json.decodeFromString<ChatResponse>(part).choices.first().delta?.let { delta ->
                    println(json.encodeToString(delta))
                    deltaMessage.copyChatMessage(delta)
                    emit(json.encodeToString(delta))
                }
            }

            messages.add(deltaMessage)

            deltaMessage.tool_calls?.forEach { call ->
                val result = mcp.callTool(call.function?.name ?: "", call.function?.arguments?.jsonToMap() ?: hashMapOf())?.content
                    ?.joinToString("\n") { (it as? TextContent)?.text ?: "" }
                    ?: ""

                messages.add(Message(
                    role = "tool",
                    content = result,
                    tool_call_id = call.id
                ))
                println(json.encodeToString(messages.last()))
                emit(json.encodeToString(messages.last()))
            } ?: break
        }
    }

    /**
     * Sends messages to the server and returns the response.
     * use okhttp3
     *
     * @param messages The list of messages to send.
     * @param tools The list of tools to use.
     */
    private fun sendMessages(messages: List<Message>, tools: List<Tool>): ChatResponse {
        val client = OkHttpClient.Builder()
            .connectTimeout(1, TimeUnit.MINUTES)
            .readTimeout(1, TimeUnit.MINUTES)
            .writeTimeout(1, TimeUnit.MINUTES)
            .build()

        val requestBody = ChatRequest(
            model = "deepseek-chat",
            messages = messages,
            tools = tools,
            stream = false
        ).let {
            val request = json.encodeToString(it)
            request
        }.toRequestBody("application/json".toMediaType())

        // 替换为有效的DeepSeek Api Key
        val request = Request.Builder()
            .url("https://api.deepseek.com/v1/chat/completions")
            .addHeader("Authorization", "Bearer sk-254dcb5c88454c2ea793804e3b76bab8")
            .post(requestBody)
            .build()

        val response = client.newCall(request).execute()
        val responseBody = response.body?.string() ?: error("Empty response")
        return json.decodeFromString<ChatResponse>(responseBody)
    }

    private fun streamMessages(messages: List<Message>, tools: List<Tool>): Flow<String> = flow {
        val client = OkHttpClient.Builder()
            .connectTimeout(1, TimeUnit.MINUTES)
            .readTimeout(1, TimeUnit.MINUTES)
            .writeTimeout(1, TimeUnit.MINUTES)
            .build()

        val requestBody = ChatRequest(
            model = "deepseek-chat",
            messages = messages,
            tools = tools,
            stream = true // 开启流式
        ).let {
            json.encodeToString(it)
        }.toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url("https://api.deepseek.com/v1/chat/completions")
            .addHeader("Authorization", "Bearer sk-254dcb5c88454c2ea793804e3b76bab8")
            .post(requestBody)
            .build()

        client.newCall(request).execute().use { response ->
            val source = response.body?.source() ?: error("No response body")

            val buffer = okio.Buffer()

            while (!source.exhausted()) {
                source.read(buffer, 8192)
                while (true) {
                    val line = buffer.readUtf8Line() ?: break

                    if (line.startsWith("data: ")) {
                        val content = line.removePrefix("data: ").trim()
                        if (content == "[DONE]") return@flow
                        emit(content)
                    }
                }
            }
        }
    }


    private fun String.jsonToMap(): Map<String, String> {
        return Json.parseToJsonElement(this).jsonObject
            .mapValues { element ->
                when (val value = element.value) {
                    is JsonPrimitive -> value.content
                    is JsonObject -> Json.encodeToString(value)
                    is JsonArray -> Json.encodeToString(value)
                    else -> value.toString()
                }
            }
    }

}