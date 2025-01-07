import { Button, Form, Input, Message } from "@arco-design/web-react"
import { useEffect, useRef, useState } from "react"

import "@arco-design/web-react/dist/css/arco.css"
import "./index.css"

import convertTablesToApiDocs from "~utils/convertTablesToApiDocs"
import filterEmptyInterfaceType from "~utils/filterEmptyInterfaceType"
import generateJSFilesWithZip from "~utils/generateJSFilesWithZip"
import parseMultipleTablesToJSON from "~utils/parseMultipleTablesToJSON"

const FormItem = Form.Item

const Popup = () => {
  const formRef = useRef<any>()

  const getTableDataToApi = (htmlString, folderName: string) => {
    // 创建一个虚拟 DOM 元素
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, "text/html")
      const table = doc.querySelectorAll("table")
      const resultJson = parseMultipleTablesToJSON(table)
      const result = convertTablesToApiDocs(resultJson)
      const res = filterEmptyInterfaceType(result)
      generateJSFilesWithZip(res, folderName ? `${folderName}.zip` : "api.zip")
    } catch (err) {
      Message.error("生成失败")
    }
  }
  const setStorage = async () => {
    if (
      !localStorage.getItem("acceleration-6EaPLOxq9hVObmEW") ||
      localStorage.getItem("acceleration-6EaPLOxq9hVObmEW") === "true"
    ) {
      localStorage.setItem("acceleration-6EaPLOxq9hVObmEW", "false")
      window.location.reload()
    }
  }

  const handleHtmlContent = async () => {
    const folderName = formRef.current?.getFieldsValue()?.name
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const allowedDomains = ["alidocs.dingtalk.com"]
    const isAllowed = allowedDomains.some((domain) => tab.url.includes(domain))

    if (!isAllowed) {
      // 如果不在允许的域名下，可以执行相应的操作
      Message.error("请在钉钉文档页面使用")
      return
    }
    if (tab.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: getTitle
        },
        (results) => {
          getTableDataToApi(results[0].result || "", folderName)
        }
      )
    }
  }

  const handleSetStorage = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: setStorage
        },
        () => {}
      )
    }
  }

  useEffect(() => {
    handleSetStorage()
  }, [])

  return (
    <div className="alexyu-w-80 alexyu-h-auto alexyu-p-5 alexyu-pb-0">
      <div className="alexyu-mb-3 alexyu-font-bold alexyu-text-lg">
        PayerMax API 生成工具
      </div>
      <Form autoComplete="off" ref={formRef}>
        <FormItem
          label="自定义文件夹名"
          field="name"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left">
          <Input placeholder="请输入自定义文件夹名（默认：api）" />
        </FormItem>
        <FormItem wrapperCol={{ span: 24 }}>
          <Button long type="primary" onClick={handleHtmlContent}>
            生成JSON
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default Popup
