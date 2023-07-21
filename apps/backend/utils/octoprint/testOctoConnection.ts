type OctoInstance = {
  ip: string
  apiKey: string
}

const testOctoConnection = async (octoInstance: OctoInstance) => {
  console.log(octoInstance)
  const { ip, apiKey } = octoInstance

  // post request to octoprint
  const formdata = new URLSearchParams()
  formdata.set('passive', '1')

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Api-Key': apiKey,
    },
    body: formdata,
  }

  try {
    console.log(`http://${ip}/api/login`)
    const response = await fetch(`http://${ip}/api/login`, options)
    const data = await response.json()
    // now we check if name and session are in the response
    if (data.name && data.session) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export default testOctoConnection
