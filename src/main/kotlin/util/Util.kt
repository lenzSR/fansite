package org.example.util

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.example.mcp.model.FunctionCall
import org.example.mcp.model.Message
import org.example.mcp.model.ToolCall
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.isAccessible

val json = Json { ignoreUnknownKeys = true }

fun Any.copyChatMessage(target: Any) {
    val properties = this::class.memberProperties
    target::class.memberProperties.forEach { targetProperty ->
        properties.find { it.name == targetProperty.name }?.let { property ->
            if (property is KMutableProperty<*>) {
                targetProperty.isAccessible = true
                targetProperty.getter.call(target)?.let { targetValue ->
                    property.isAccessible = true
                    val value = property.getter.call(this)
//                    println("${property.name} ${targetProperty.name}")
                    when (targetProperty.returnType.classifier) {
                        String::class -> {
                            if (value == null)
                                property.setter.call(this, targetValue)
                            else
                                property.setter.call(this, "$value$targetValue")
                        }
                        Int::class -> property.setter.call(this, targetValue)
                        List::class -> {
                            if (value == null) {
                                property.setter.call(this, targetValue)
                            } else {
                                val targetList = targetValue as List<*>
                                val sourceList = value as List<*>
                                property.setter.call(this, List(sourceList.size) { index ->
                                    sourceList[index]!!.copyChatMessage(targetList[index]!!)
                                    sourceList[index]!!
                                })
                            }
                        }
                        else -> {
                            if (value == null) {
                                property.setter.call(this, targetValue)
                            } else {
                                value.copyChatMessage(targetValue)
//                                println(json.encodeToString(value as FunctionCall))
                                property.setter.call(this, value)
                            }
                        }
                    }
                }
            }
        }
    }
}

fun main() {

    val message = Message()
    val delta = Message().apply {
        role = "assistant"
        content = ""
    }

    message.copyChatMessage(delta)
    println(json.encodeToString(message))

    /**
     * {"tool_calls":[{"id":"call_0_bdb08e5a-8a0a-43a4-9632-074bb881634a","function":{"name":"listMemberInfo","arguments":""},"index":0,"type":"function"}]}
     * {"tool_calls":[{"function":{"arguments":"{\""},"index":0}]}
     */
    val delta2 = Message().apply {
        tool_calls = listOf(ToolCall().apply {
            id = "call_0_bdb08e5a-8a0a-43a4-9632-074bb881634a"
            function = FunctionCall().apply {
                name = "listMemberInfo"
                arguments = ""
            }
            index = 0
            type = "function"
        })
    }

    val delta3 = Message().apply {
        tool_calls = listOf(ToolCall().apply {
            function = FunctionCall().apply {
                arguments = "{\"memberName\":\"isui\"}"
            }
            index = 0
        })
    }

    message.copyChatMessage(delta2)
    println(json.encodeToString(message))

    message.copyChatMessage(delta3)
    println(json.encodeToString(message))
}