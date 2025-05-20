package org.example.util

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.encodeToString
import java.util.*
import kotlin.uuid.ExperimentalUuidApi

object MockUtil {
    private var toolCallIds = List(3) { UUID.randomUUID() }

    private val str: String
        get() = """
            {
              "role": "assistant",
              "content": "",
              "tool_calls": [
                {
                  "id": "${toolCallIds[0]}",
                  "function": {
                    "name": "listAllApis",
                    "arguments": "{}"
                  },
                  "index": 0,
                  "type": "function"
                }
              ]
            }#####
            {
              "role": "tool",
              "content": "可用API列表(apiId-Name-Description):\n\n这是一段模拟数据，如需要进行完整的对话，请准备自己的SSE MCP服务器和DeepSeek API KEY。",
              "tool_call_id": "${toolCallIds[0]}"
            }#####
            {
              "role": "assistant",
              "content": "",
              "tool_calls": [
                {
                  "id": "${toolCallIds[1]}",
                  "function": {
                    "name": "functionName",
                    "arguments": "{\"apiId\":\"functionName\"}"
                  },
                  "index": 0,
                  "type": "function"
                }
              ]
            }#####
            {
              "role": "tool",
              "content": "API详细信息:\n这是一段模拟数据，如需要进行完整的对话，请准备自己的SSE MCP服务器和DeepSeek API KEY。",
              "tool_call_id": "${toolCallIds[1]}"
            }#####
            {
              "role": "assistant",
              "content": "",
              "tool_calls": [
                {
                  "id": "${toolCallIds[2]}",
                  "function": {
                    "name": "executeApi",
                    "arguments": "{\"apiId\":\"functionName\",\"params\":{\"param1\":\"value1\"}}"
                  },
                  "index": 0,
                  "type": "function"
                }
              ]
            }#####
            {
              "role": "tool",
              "content": "这是一段模拟数据，如需要进行完整的对话，请准备自己的SSE MCP服务器和DeepSeek API KEY。",
              "tool_call_id": "${toolCallIds[2]}"
            }#####
            {
              "role": "assistant",
              "content": "这是一段模拟数据，如需要进行完整的对话，请准备：\n\n- **MCP服务器**: 使用SSE方式传输\n- **APi KEY**: DeepSeek API KEY\n"
            }
    """.trimIndent()

    private val streamMockStr
        get() = """
            {"role":"assistant","content":""}
            {"tool_calls":[{"id":"call_0_a6d42b91-ebd9-4a9e-b383-208bab1ead01","function":{"name":"listMemberInfo","arguments":""},"index":0,"type":"function"}]}
            {"tool_calls":[{"function":{"arguments":"{\""},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"member"},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"Name"},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"\":\""},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"is"},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"ui"},"index":0}]}
            {"tool_calls":[{"function":{"arguments":"\"}"},"index":0}]}
            {"content":""}
            {"role":"tool","content":"乐队成员isui的相关信息:\n\nquestion: 乐队是什么时候成立的?\nanswer: tayori正式成立于2023年7月22日！raku和tazuneru原本是islet组合，后来与主唱isui碰撞出火花，就组成了现在的tayori。✨\n\nquestion: 乐队什么时候成立?\nanswer: tayori正式成立于2023年7月22日！raku和tazuneru原本是islet组合，后来与主唱isui碰撞出火花，就组成了现在的tayori。✨\n\nquestion: 成员们各自的角色是什么?\nanswer: isui是我们的主唱，拥有清澈而富有感染力的声线。raku负责作曲，是旋律的织造者。tazuneru则负责音乐制作和编曲，擅长音色的打磨和氛围营造。🎵\n\nquestion: 成员角色?\nanswer: isui是我们的主唱，拥有清澈而富有感染力的声线。raku负责作曲，是旋律的织造者。tazuneru则负责音乐制作和编曲，擅长音色的打磨和氛围营造。🎵\n\nquestion: isui是谁?\nanswer: isui (倚水) 是tayori的主唱，拥有清澈而富有感染力的声线。她的歌声为乐队的乐曲注入灵魂，细腻地诠释每一份情感，引领听众进入tayori的音乐世界。🎤\n\n","tool_call_id":"call_0_a6d42b91-ebd9-4a9e-b383-208bab1ead01"}
            {"role":"assistant","content":""}
            {"content":"is"}
            {"content":"ui"}
            {"content":"（"}
            {"content":"倚"}
            {"content":"水"}
            {"content":"）"}
            {"content":"是"}
            {"content":"音乐"}
            {"content":"组合"}
            {"content":"t"}
            {"content":"ay"}
            {"content":"ori"}
            {"content":"的主"}
            {"content":"唱"}
            {"content":"，"}
            {"content":"她"}
            {"content":"拥有"}
            {"content":"清澈"}
            {"content":"而"}
            {"content":"富有"}
            {"content":"感染"}
            {"content":"力的"}
            {"content":"声"}
            {"content":"线"}
            {"content":"，"}
            {"content":"能够"}
            {"content":"细腻"}
            {"content":"地"}
            {"content":"诠释"}
            {"content":"每一"}
            {"content":"份"}
            {"content":"情感"}
            {"content":"，"}
            {"content":"为"}
            {"content":"乐"}
            {"content":"队的"}
            {"content":"音乐"}
            {"content":"注入"}
            {"content":"灵魂"}
            {"content":"。"}
            {"content":"她的"}
            {"content":"歌声"}
            {"content":"引领"}
            {"content":"听众"}
            {"content":"进入"}
            {"content":"t"}
            {"content":"ay"}
            {"content":"ori"}
            {"content":"独特的"}
            {"content":"音乐"}
            {"content":"世界"}
            {"content":"，"}
            {"content":"是"}
            {"content":"乐队"}
            {"content":"不可或缺"}
            {"content":"的核心"}
            {"content":"成员"}
            {"content":"之一"}
            {"content":"。"}
            {"content":"🎤"}
            {"content":"✨"}
            {"content":""}
        """.trimIndent()

    suspend fun send(): Flow<String> = flow {
        toolCallIds = List(3) { UUID.randomUUID() }
        str.split("#####").forEach { value ->
            emit(value.trimIndent().replace("\n", ""))
            delay(1000)
        }
    }

    suspend fun sendStreamMockStr(): Flow<String> = flow {
        streamMockStr.split("\n").forEach { value ->
            emit(value.trimIndent().replace("\n", ""))
            delay(100)
        }
    }
}