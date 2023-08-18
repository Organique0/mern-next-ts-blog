import Pagination from "@/components/Pagination";
import { Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <div>
        hello
        <Button className="btn btn-primary">dan</Button>
        <Button className="btn btn-secondary">noč</Button>
        <Pagination currentPage={2} onPageItemClicked={() => { }} pageCount={3} className="" />
      </div>
    </>
  )
}
