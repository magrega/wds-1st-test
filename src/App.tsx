import { useState } from "react"
import { Select, SelectOption } from "./Select"

const options = [
  { label: 'First', value: 1 },
  { label: 'Second', value: 2 },
  { label: 'Third', value: 3 },
  { label: 'Fourth', value: 4 },
  { label: 'Fifth', value: 5 },
]

const App = () => {
  const [value, setValue] = useState<SelectOption | undefined>(options[0]);
  const [valueM, setValueM] = useState<SelectOption[]>([]);

  return (
    <>
      <Select options={options} value={value} onChange={o => setValue(o)} multiple={false}></Select >
      <Select options={options} value={valueM} onChange={o => setValueM(o)} multiple={true}></Select >
    </>
  )
}

export default App
