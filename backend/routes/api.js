const express = require('express')
const router = express.Router()
const Memory = require('../models/Memory')
const geminiService = require('../services/geminiService')

router.post('/memories', async (req, res) => {
  try {
    const savedMemory = await Memory.create(req.body)
    res.json(savedMemory)
  } catch (error) {
    res.status(500).json({ error: "Failed to save" })
  }
})

router.get('/memories', async (req, res) => {
  try {
    const result=await Memory.find()
    res.json(result)
  } catch (error) {
    res.status(500).json({error:"Failed to get list"})
  }
})

router.post('/query',async(req,res)=>{
  try {
    const { query, entity }=req.body
    const result=await Memory.find()

    const bestMemories=result.filter((m)=>m.content.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    const aiAnswer=await geminiService.askGemini(query, bestMemories)
    
    res.json({
        decision:aiAnswer,
        context:bestMemories
    })
    
  } catch (error) {
    res.status(500).json({ error: "Failed to process query" })
  }
})
module.exports = router
