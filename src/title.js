import React from 'react';
import { Container } from 'reactstrap';

const Title = () => {
    return (
        <div className="title">

            <Container fluid>
                <h1 className="display-7">🗺<span className="emoji">The Map App </span></h1>
                <p className="lead"></p>
            </Container>

        </div>
    )
}


export default Title;