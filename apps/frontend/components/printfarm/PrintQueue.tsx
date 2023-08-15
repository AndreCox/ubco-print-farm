import { Card, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { database } from '../../surreal/surreal'
import { authenticator } from '../../helpers/authentication/authenticator'

const updatePrintQueue = (database, setPrintQueue) => {
  database.db
    .use({
      ns: 'PrintFarm',
      db: 'users',
    })
    .then((res) => {
      database.db
        .query('SELECT printQueue FROM $user', {
          user: authenticator.userID,
        })
        .then((res) => {
          setPrintQueue(res[0].result[0].printQueue)
        })
        .catch((err) => {})
    })
    .catch((err) => {})
}

const PrintQueueHeaders = () => {
  return (
    <div className="flex flex-col px-4">
      <div className="flex flex-row justify-between ">
        <div className="w-full">
          <Typography color="blue-gray" className="text-center mb-2">
            Print Name
          </Typography>
        </div>
        <div className="w-full">
          <Typography color="blue-gray" className="text-center mb-2">
            Status
          </Typography>
        </div>
        <div className="w-full">
          <Typography color="blue-gray" className="text-center mb-2">
            Time Remaining
          </Typography>
        </div>
        <div className="invisible pr-2">
          <Typography color="blue-gray" className="text-center">
            ❌
          </Typography>
        </div>
      </div>
    </div>
  )
}

const PrintQueue = () => {
  const [printQueue, setPrintQueue] = useState([])

  useEffect(() => {
    // we have to run our query out of the interval first just so we don't have to wait for the first interval
    updatePrintQueue(database, setPrintQueue)
    // this gets the print queue we set up a polling system to update the print queue
    // this should be updated to live query once surrealdb 1.0 is released
    const interval = setInterval(() => {
      updatePrintQueue(database, setPrintQueue)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="h-full">
      <Typography variant="h4" color="blue" className="text-center mt-4">
        Print Queue
      </Typography>
      <hr className="mb-4" />
      <PrintQueueHeaders />
      <hr className="mb-4" />
      <div className="flex flex-col px-4 space-y-4 h-full mb-4">
        {printQueue.length === 0 && (
          <div className="flex flex-col justify-center h-full">
            <Typography color="blue-gray" className="text-center pb-12">
              You don&apos;t have any prints in your queue right now
            </Typography>
          </div>
        )}
        {printQueue.map((print, index) => {
          // convert the string to a object
          // if the print is empty return
          if (!print) return <></>

          return (
            <div
              key={index}
              className="flex flex-row justify-between border rounded-md py-2 bg-orange-50 shadow-sm"
            >
              <div className="w-full">
                <Typography color="blue-gray" className="text-center ">
                  {print.fileName}
                </Typography>
              </div>
              <div className="w-full">
                <Typography color="blue-gray" className="text-center">
                  {print.status}
                </Typography>
              </div>
              <div className="w-full">
                <Typography color="blue-gray" className="text-center">
                  NaN
                </Typography>
              </div>
              <button
                className=""
                style={{
                  visibility:
                    print.status === 'printing' ? 'hidden' : 'visible',
                }}
                onClick={() => {
                  console.log('cancel print: ' + index)
                  database.db
                    .use({
                      ns: 'PrintFarm',
                      db: 'users',
                    })
                    .then((res) => {
                      database.db
                        .query(
                          'UPDATE $user SET printQueue = array::remove(printQueue, $index)',
                          {
                            user: authenticator.userID,
                            index: index,
                          }
                        )
                        .then((res) => {
                          // update the print queue so user sees results immediately
                          console.log(res)
                          updatePrintQueue(database, setPrintQueue)
                        })
                        .catch((err) => {
                          console.log(err)
                        })
                    })
                }}
              >
                <Typography
                  color="blue-gray"
                  className="text-center pr-2 drop-shadow-sm hover:drop-shadow-lg transition-all"
                >
                  ❌
                </Typography>
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default PrintQueue
