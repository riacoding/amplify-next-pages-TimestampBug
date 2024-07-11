export function timeDifference(date: string) {
  function formatTimeDifference(timeDifferenceInSeconds: number) {
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds === 1 ? '' : 's'} ago`
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60)

      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600)

      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else {
      const days = Math.floor(timeDifferenceInSeconds / 86400)

      return `${days} day${days === 1 ? '' : 's'} ago`
    }
  }

  // usage:
  const pastDate: Date = new Date(date)
  const currentDate: number = Date.now()
  const timeDifferenceInSeconds: number = Math.floor((currentDate - pastDate.valueOf()) / 1000)
  const formattedTimeDifference: string = formatTimeDifference(timeDifferenceInSeconds)

  return formattedTimeDifference
}
