import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useClients(withProjects = false) {
  const url = `${APIROUTES.GET.CLIENTS}${withProjects ? '&withProjects' : ''}`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}