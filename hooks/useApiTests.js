import { APIROUTES } from "config/routes"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useApiTests(query) {
  const { data, error, mutate } = useSWR(`/api/tests?q=${query}`, fetchJson)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}