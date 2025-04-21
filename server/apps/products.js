import { Router } from "express";
import { db } from "../utils/db.js"
import { ObjectId } from "mongodb";

const productRouter = Router();

const collection = db.collection("products");

productRouter.get("/", async (req, res) => {
    //1 select collection
    //2 access req and body
    const keywords = req.query.keywords;
    const category = req.query.category;
    const filter = {};
    if (keywords) {
        filter.name = { $regex: keywords, $options: "i" };
    }
    if (category) {
        filter.category = category;
    }
    //3 execute
    try {
        const result = await collection
        .find(filter)
        .toArray();
        //4 res section
        if (!result) {
            return res.status(404).json({
                "message": "Product not found"
            })
        }
        return res.status(200).json({
            "data" : result 
    });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "500 Internal Server Error"
        })
    }

});

productRouter.get("/:id", async (req, res) => {
    //1 select collection
    //2 access req and body
    const productIdFromClient = req.params.id;
    const filter = {_id: new ObjectId(productIdFromClient)}
    //3 execute
    try {
        const result = await collection
        .findOne(filter, {projection: {image: 0}});
        //4 res section
        if (!result) {
            res.status(404).json({
                "message": "Product not found"
            })
        }
        return res.status(200).json({
            "data": result
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "500 Internal Server Error"
        })
    }

});

productRouter.post("/", async (req, res) => {
    //1 select collection
    //const collection = db.collection("products");
    //2 access req and body
    const newProduct = {...req.body,
        "created_at": new Date()
    };
    //3 execute
    try {
        const result = await collection
        .insertOne(
            newProduct
        );
        //4 res section
        return res.status(201).json({
            "message": "Product has been created successfully",
            "product_id": result.insertedId
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "500 Internal Server Error"
        });
    }
    
});

productRouter.put("/:productId", async (req, res) => {
    //1 select collection
    //2 access req and body
    const productIdFromClient = req.params.productId;
    const updateProduct = {...req.body};
    const filter = {_id: new ObjectId(productIdFromClient)}
    //3 execute
    try {
        const result = await collection
        .updateOne(filter,{$set: updateProduct})
        //4 res section
        if (result.matchedCount === 0){
            return res.status(404).json({
                "message": "Product not found"
            })
        }
        return res.status(200).json({
            "message": "Product has been updated successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "500 Internal Server Error"
        });
    }

});

productRouter.delete("/:id", async (req, res) => {
    //1 select collection
    //2 access req and body
    const productIdFromClient = req.params.id;
    const filter = {_id: new ObjectId(productIdFromClient)};
    //3 execute
    try {
        const result = await collection
        .deleteOne(filter);
        //4 res section
        if (result.deletedCount === 0){
            return res.status(404).json({
                "message": "Product not found"
            })
        }
        return res.status(200).json({
            "message": "Product has been deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "500 Internal Server Error"
        })
    }

});

export default productRouter;
