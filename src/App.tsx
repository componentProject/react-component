import './App.css'
import { useRoutes} from "react-router";
import {Suspense} from 'react'
import routes from "./router";
function App() {
  return (
    <>
			<Suspense fallback={<div>你好,我在加载了</div>}>
				{useRoutes(routes)}
			</Suspense>
    </>
  )
}

export default App
