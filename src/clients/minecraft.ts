import * as minecraftProtocol from 'minecraft-protocol';
import { z } from 'zod';

const pingResultSchema = z.object({
  online: z.boolean(),
  players: z.object({
    online: z.number(),
  }),
})

export const pingServer = async (server: McServer): Promise<z.infer<typeof pingResultSchema> | { online: false }> => {
  return new Promise((resolve) => {
    minecraftProtocol.ping({
      host: server.host,
      port: server.port,
      closeTimeout: 3000,
    }, (err, results) => {
      if (err) {
        resolve({
          online: false,
        })
      } else {
        resolve(pingResultSchema.parse({
          ...results,
          online: true,
        }))
      }
    })
  })
}
