import { Badge } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom';
import { isAnon } from '../utils';
import "bootstrap/dist/css/bootstrap.min.css"

function ProductCard ({product, user}) {
    return (
        <Card className="m-3">
            <Card.Body>
                <Card.Title>{product.name} <Badge variant="secondary">{product.id}</Badge></Card.Title>
                {!isAnon(user) && <Link to={`/product/${product._id}`} className="card-link">Add to list</Link>}
            </Card.Body>
        </Card>
    )
}

export default ProductCard