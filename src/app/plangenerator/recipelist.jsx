"use client"

import PocketBase from 'pocketbase'

import { useState, useEffect } from 'react';

export default function RecipeList() {
    const [recipes, setRecipes] = useState(null)
    const [weeklyPlan, setWeeklyPlan] = useState(new Map())
    const [isLoading, setLoading] = useState(true)

    const pb = new PocketBase('https://recipe.pockethost.io/')
    pb.autoCancellation(false)

    useEffect(() => {
        async function fetchData() {
            const reciperecords = await pb.collection('recipes').getFullList({
                sort: '-created', expand: "ingredients"
            })
            setRecipes(reciperecords)
            setLoading(false)
        }

        fetchData()
    })

    const generateRecipes = () => {
        var tempRecipes = new Map
        var tempRecipes = recipes
        console.log(tempRecipes)
        var weeklyPlanMap = new Map([["Monday", 0], ["Tuesday", 0], ["Wednesday", 0], ["Thursday", 0], ["Friday", 0], ["Saturday", 0], ["Sunday", 0]])

        weeklyPlanMap.forEach((value, key) => {
            const arrayRecipes = Array.from(tempRecipes)
            //console.log(arrayRecipes)
            const randomValue = Math.floor(Math.random() * arrayRecipes.length)
            const tempRecipe = arrayRecipes[randomValue]
            console.log(tempRecipe)
            weeklyPlanMap.set(key, tempRecipe)
        })

        console.log(weeklyPlanMap)
        setWeeklyPlan(weeklyPlanMap)
        console.log(weeklyPlan)
    }

    if (isLoading) return <p>Loading</p>

    if (recipes.length < 7)
    {
        return (
            <p className = "text-center">There are not enough recipes to generate a unique meal plan. Please add at least 7 recipes</p>
        )
    }
    else if (recipes.length >= 7)
    {
        if (weeklyPlan)
        {
            return (
                <>
                {Array.from(weeklyPlan.entries()).map(([day, recipe]) => (
                    <div key={day} className="card my-5">
                        <h2>{day}</h2>
                        <h3>{recipe.title}</h3>
                        {recipe.expand.ingredients.map(ingredients => (
                            <div key = {ingredients.id}>
                                <p>{ingredients.ingredient}</p>
                            </div>
                        ))}
                        <h3>{recipe.instructions}</h3>
                    </div>
                ))}
                <button className = "btn-primary" onClick={generateRecipes}>
                    Generate Recipes
                </button>
        
                </>
            )
        }
        else{
            return (
                <>
                <button className = "btn-primary" onClick={generateRecipes}>
                    Generate Recipes
                </button>
                </> 
            )
        }
    }
}