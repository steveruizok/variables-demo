import { useSelector } from "state"

export default function useVariable(scope: string, id: string) {
  return useSelector((state) => state.data.variables[scope][id])
}
