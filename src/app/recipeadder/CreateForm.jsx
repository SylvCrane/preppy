"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

let counter = 0

export default function CreateForm() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState([{
        ingredient: ''
    }])
    const [instructions, setInstructions] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleIngredientsChange = (index, e) => {
        const newIngredients = [...ingredients]

        newIngredients[index].ingredient = e.target.value
        setIngredients(newIngredients)
    }

    const addNewIngredientField = () => {
        setIngredients([...ingredients, {ingredient: ''}])
    };

    const removeIngredientField = index => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const recipe = {
            title, ingredients, instructions
        }

        const res = await fetch('http://localhost:4000/recipes', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(recipe)
        })

        if (res.status === 201)
        {
            router.refresh()
            router.push('/plangenerator')
        }
      }

      

    return (
        <form className="w-1/2" onSubmit={handleSubmit}>
            <label>
                <span>Title:</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value = {title}
                />     
            </label>
            <label>
                <span>Ingredients:</span>
                {ingredients.map((input, index) => (
                    <div key = {index}>
                        <input 
                            required   
                            type="text"
                            onChange={(e) => handleIngredientsChange(index, e)}
                        />
                        <button className="btn-primary" onClick={() => removeIngredientField(index)}>Remove Ingredient</button>
                    </div>
                    
                ))}
            </label>
            <button className="btn-primary" onClick={addNewIngredientField}>Add Ingredient</button>
            <label>
                <span>Instructions:</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setInstructions(e.target.value)}
                    value = {instructions}
                />     
            </label>
            
            <button
                className="btn-primary"
                disabled={isLoading}
            >
                {isLoading && <span>Adding...</span>}
                {!isLoading && <span>Add Recipe</span>}
            </button>
        </form>
    )
}