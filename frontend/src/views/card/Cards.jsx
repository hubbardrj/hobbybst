import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import CardDetailView from './CardDetailView'
import CardListView from './CardListView'
import CardAddView from './CardAddView'

import useCardService from './CardService';
import useFileService from '../../services/FileService';

const Cards = () => {
    const [cardService] = useState(useCardService());
    const [fileService] = useState(useFileService());
    
    return (
        <Routes>
            <Route
                path=""
                element={<CardListView cardService={cardService} />}
            />
            <Route
                path="/add"
                element={<CardAddView cardService={cardService} fileService={fileService} />}
            />
            <Route
                path="/:id"
                element={<CardDetailView cardService={cardService} />}
            />
            <Route
                path="/:id/edit"
                element={<CardAddView cardService={cardService} fileService={fileService} editMode={true} />}
            />
        </Routes>
    )
}

export default Cards