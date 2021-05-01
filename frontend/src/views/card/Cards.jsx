import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import CardDetailView from './CardDetailView'
import CardListView from './CardListView'
import CardAddView from './CardAddView'

import useCardService from './CardService';

const Cards = () => {
    const [cardService] = useState(useCardService());
    
    return (
        <Routes>
            <Route
                path=""
                element={<CardListView cardService={cardService} />}
            />
            <Route
                path="/add"
                element={<CardAddView cardService={cardService} />}
            />
            <Route
                path="/:id"
                element={<CardDetailView cardService={cardService} />}
            />
            <Route
                path="/:id/edit"
                element={<CardAddView cardService={cardService} editMode={true} />}
            />
        </Routes>
    )
}

export default Cards