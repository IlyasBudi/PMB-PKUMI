"use client"
/* Components */
import { Accordion, AccordionTab } from "primereact/accordion"

export default function AccordionData({ data = [] }) {
  return (
    <Accordion multiple activeIndex={[0]}>
      {data.map(({ title, detail }, index) => (
        <AccordionTab key={index} header={title}>
          <p>{detail}</p>
        </AccordionTab>
      ))}
    </Accordion>
  )
}
