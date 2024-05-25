import { getAllContents, getContentByPid } from '@/lib/readPost'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

const Post: React.FC<{pid: string, data: Record<string, string>, content: string}> = (args) => {

  return (
    <div>
      <ul>
        {Object.entries(args.data).map(([k,v]) => {
          return (
            <li key={k}>{k} : {v}</li>
          )
        })}
      </ul>
      <div dangerouslySetInnerHTML={{__html: args.content}} />
    </div>
  )
}

export default Post

export const getStaticPaths: GetStaticPaths = async () => {
  const contents = await getAllContents()
  const paths = contents.map((post) => {
    return {
      params: {pid: post.pid}
    }
  })

  return {paths, fallback: false}
}


export const getStaticProps: GetStaticProps<{pid: string}, {pid: string}>  = async ({params}) => {
  const content  = await getContentByPid(params?.pid || '')
  const {pid, data, value} = content
  return {
    props: {
      pid,
      data,
      content: String(value)
    }
  }
}