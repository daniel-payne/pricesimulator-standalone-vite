import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DefaultElement({ name = "DefaultElement", children, ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-controller={name} style={{ border: "1px solid #006A4E", padding: 2 }}>
      <h1>{name}</h1>

      {children}
    </div>
  )
}
