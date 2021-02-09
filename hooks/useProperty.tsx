import { useSelector } from "state"

export default function useProperty(scope: string, id: string) {
  return useSelector((state) => state.data.properties[scope][id])
}
