package org.example.mcp.model

import kotlinx.serialization.Serializable

// 定义数据模型（使用 kotlinx.serialization）
@Serializable
class Message {
    var role: String? = null
    var content: String? = null
    var tool_calls: List<ToolCall>? = null
    var tool_call_id: String? = null

    constructor()

    constructor(role: String, content: String, tool_call_id: String? = null) {
        this.role = role
        this.content = content
        this.tool_call_id = tool_call_id
    }
}

@Serializable
class ToolCall {
    var id: String? = null
    var function: FunctionCall? = null
    var index: Int? = null
    var type: String? = null
}

@Serializable
class FunctionCall {
    var name: String? = null
    var arguments: String? = null
}

@Serializable
data class ChatRequest(
    val model: String,
    val messages: List<Message>,
    val tools: List<Tool>,
    val stream: Boolean
)

@Serializable
data class Tool(
    val type: String,
    val function: ToolFunction
)

@Serializable
data class ToolFunction(
    val name: String,
    val description: String,
    val parameters: ToolParameters
)

@Serializable
data class ToolParameters(
    val type: String,
    val properties: Map<String, Property>,
    val required: List<String>
)

@Serializable
data class Property(
    val type: String,
    val description: String
)

@Serializable
data class ChatResponse(
    val choices: List<Choice>
)

@Serializable
data class Choice(
    val message: Message? = null,
    val delta: Message? = null
)

