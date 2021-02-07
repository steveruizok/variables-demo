import { useSelector } from "state"

export default function useVariable(id: string) {
  return useSelector((state) => state.data.variables.get(id))
}
