import { join } from "path"
import { remark } from 'remark'
import remarkFrontmatter from "remark-frontmatter"
import remarkHtml from 'remark-html'
import remarkFrontmatterPlugin from 'remark-extract-frontmatter'
import {parse as yaml} from 'yaml'
import {VFile} from 'vfile'
import fs from 'fs'
import path from "path"

const contentsDirectory = join(process.cwd(), "contents")

export const getContentByPid = async (pid: string) => {
  const fullPath = join(contentsDirectory, `${pid}.md`)
  const fileContent = fs.readFileSync(fullPath, "utf8")
  const markdownToHtmlRes = await markdownToHtml(fileContent)
  console.log('markdownToHtmlRes', markdownToHtmlRes)
  
  return {...markdownToHtmlRes, pid}
}

export const getAllContents = async () => {
  const contentFilenames = fs.readdirSync(contentsDirectory)
  const contents = await Promise.all(
    contentFilenames
      .map((filename) => path.parse(filename).name)
      .map((pid) => getContentByPid(pid))
  )

  return contents
}

const markdownToHtml = async (markdown: string): Promise<VFile> => await remark()
  .use(remarkFrontmatter)
  .use(remarkHtml)
  .use(remarkFrontmatterPlugin, { yaml })
  .process(markdown)