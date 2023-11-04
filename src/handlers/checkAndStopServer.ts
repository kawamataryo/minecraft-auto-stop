import { EC2 } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { MC_SERVERS } from '../constants';
import { pingServer } from '../clients/minecraft';

export const run: Handler = async (event, context) => {
  // Loop over MC_SERVERS array and check each server's status
  const targetServers = await Promise.all(MC_SERVERS.map(async (server) => {
    try {
      // Fetch the server status
      const pingResult = await pingServer(server)

      // If the server is online and no players are online, suspend it
      if (pingResult.online && pingResult.players.online === 0) {
        return server
      } else {
        return null
      }
    } catch (e) {
      console.error(e)
      return null
    }
  })).then(servers => servers.filter((server): server is McServer => !!server))

  // If no servers were found, return a message
  if (targetServers.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No online servers found'
      }),
    }
  }

  // Stop all servers in the targetServers array
  const stopInstancesResult = await new EC2().stopInstances({
    InstanceIds: targetServers.map(server => server.instanceId)
  }).promise()

  // Get the names of the stopped servers
  const stoppedServerNames = stopInstancesResult.StoppingInstances?.map(instance => {
    return MC_SERVERS.find(server => server.instanceId === instance.InstanceId)
  }).filter((server): server is McServer => !!server)

  // Return a message with the names of the stopped servers
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Stopped servers',
      stoppedServers: stoppedServerNames
    })
  }
};
