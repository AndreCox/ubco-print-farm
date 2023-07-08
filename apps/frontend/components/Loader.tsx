import loadingMessages from '../helpers/loadingMessages'

type LoadingProps = {
  loadingMessage: string
}

const Loading = ({ loadingMessage }) => {
  return (
    <div className="w-screen h-screen flex flex-row justify-center">
      <div className="flex flex-col justify-center space-y-8">
        <h1 className="text-center w-screen text-xl">Loading, Hang Tight!</h1>

        <div className="flex flex-row justify-center w-screen">
          <div
            className="inline-block h-24 w-24 animate-spin drop-shadow-lg text-blue-500 rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
        <a className="text-center w-screen">{loadingMessage}</a>
      </div>
    </div>
  )
}

export default Loading
