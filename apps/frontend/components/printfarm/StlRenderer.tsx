import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Spinner } from '@material-tailwind/react'

const StlViewer = dynamic(
  () => import('react-stl-viewer').then((mod) => mod.StlViewer),
  { ssr: false }
)

const StlRenderer = ({ stlFile }) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [stlFile])

  return (
    <>
      {stlFile && (
        <>
          <div
            style={{
              overflow: 'clip',
              height: loaded ? 'auto' : '0',
            }}
          >
            <StlViewer
              url={stlFile}
              shadows={true}
              orbitControls={true}
              className="h-96 rounded-md"
              style={{
                visibility: loaded ? 'visible' : 'hidden',
              }}
              onFinishLoading={() => {
                console.log('finished loading')
                setLoaded(true)
              }}
            />
          </div>
          <div
            className="h-96"
            style={{
              display: loaded ? 'none' : 'block',
            }}
          >
            <div className="flex flex-row justify-center h-full">
              <div className="flex flex-col justify-center">
                <Spinner className="h-12 w-12">Loading...</Spinner>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default StlRenderer
