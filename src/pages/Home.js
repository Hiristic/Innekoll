import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

function Home ({mongoContext: {client, user}}) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData () {
            console.time("Get products data")
            const rests = client.db('innekoll').collection('products')
            setProducts((await rests.find()).slice(0, 10))
            setLoading(false)
            console.timeEnd("Get products data")
        }

        if (loading && user && client) {
            getData()
        }
    }, [client, loading, user])

    return (
        <div className="mt-3">
            {loading && (
                <div className="text-center">
                    <Loading />
                </div>
            )}
            {products.map((product) => (
                <ProductCard key={product._id} product={product} user={user} />
            ))}
        </div>
    )
}

export default Home