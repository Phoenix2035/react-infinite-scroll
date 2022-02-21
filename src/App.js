import { useState, useRef, useCallback } from "react"
import useBookSearch from "./hooks/useBookSearch"


function App() {
    const [query, setQuery] = useState("")
    const [pageNumber, setPageNumber] = useState(1)

    const { loading, error, books, hasMore } = useBookSearch(query, pageNumber)

    const observer = useRef()
    const lastBookElementRef = useCallback((node) => {
        if (loading) return

        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const handleSearch = (e) => {
        setQuery(e.target.value)
        setPageNumber(1)
    }



    return (
        <div className="container">
            <input type="text" onChange={handleSearch} value={query} />
            {
                books.map((item, index) => {
                    if (books.length === index + 1) {
                        return <div key={item} ref={lastBookElementRef}>
                            {item}
                        </div>
                    } else {
                        return <div key={item}>
                            {item}
                        </div>
                    }
                })}
            <div>{loading && "Loading..."}</div>
            <div>{error && "Error"}</div>
        </div>
    );
}

export default App;
