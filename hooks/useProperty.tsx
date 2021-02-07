import { useSelector } from "state"

export default function useProperty(id: string) {
  return useSelector((state) => state.data.variables.get(id))
}
