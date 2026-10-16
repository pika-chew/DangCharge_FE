import { mkdir, writeFile } from 'node:fs/promises'

const services = ['query', 'command']
const directory = new URL('../openapi/', import.meta.url)

// 두 명세를 모두 받은 뒤 저장해 다운로드 실패 시 기존 명세를 유지합니다.
const documents = await Promise.all(services.map(async (service) => {
  const url = `https://api.dangcharge.cloud/${service}/v3/api-docs`
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`${service} 명세 다운로드 실패: HTTP ${response.status}`)

  const document = await response.json()
  if (!document.openapi || !document.paths) {
    throw new Error(`${service} 응답이 OpenAPI 명세가 아닙니다.`)
  }

  return { service, document }
}))

await mkdir(directory, { recursive: true })
for (const { service, document } of documents) {
  await writeFile(new URL(`${service}.json`, directory), `${JSON.stringify(document, null, 2)}\n`)
  console.log(`${service} 명세 저장 완료`)
}
