import Pagination from "@/components/Pagination";
import { Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <div className="text-center mt-5">
        <h1 >Greetings traveler</h1>
        <p className="lh-2">
          This is a site that allows you to view blog posts and create your own if you have an accout. <br />
          It also has a great comments section inspired by Youtube. <br />
          Blog posts are created using markdown so you can format them however you like. <br />
          Markdown has similar features to something like a simple word editor. <br />
          You are able to upload the main image and then even add images to your blog posts. <br />
        </p>
      </div>
    </>
  )
}
