import * as Minio from 'minio'

//
const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'printfarm',
  secretKey: 'changeinprod',
})

const setupMinio = async () => {
  // check if bucket exists
  const exists = await minioClient.bucketExists('printfarm')

  if (exists) return console.log('Bucket already exists.')

  console.log('Creating bucket...')
  minioClient.makeBucket('printfarm', 'us-east-1', function (err) {
    if (err) return console.log(err)
    console.log('Successfully created bucket.')
  })
}

export { setupMinio, minioClient }
