import { useSelector } from "state"

export default function useSelected() {
  return useSelector((state) => state.values.selected)
}
