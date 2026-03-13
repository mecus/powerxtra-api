export function createIcyMetadata(title: string) {

  const metadata = `StreamTitle='${title}';`

  const length = Math.ceil(metadata.length / 16)

  const buffer = Buffer.alloc(1 + length * 16)

  buffer.writeUInt8(length, 0)

  buffer.write(metadata, 1)

  return buffer

}
export function buildIcyMetadata(title: string) {
  const metadata = `StreamTitle='${title}';`
  const len = Math.ceil(metadata.length / 16)
  const buffer = Buffer.alloc(len * 16)

  buffer.write(metadata)

  return Buffer.concat([
    Buffer.from([len]),
    buffer
  ])
}
