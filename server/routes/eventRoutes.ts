import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  try {
    res.send("Events route");
  } catch (error) {
    console.error(error);
  }
});

router.get("/events", (_req: Request, res: Response) => {
  try {
    res.send("Events Get route");
  } catch (error: any) {
    console.error(error);
  }
});

router.post("/events", (_req: Request, res: Response) => {
  try {
    res.send("Events post route");
  } catch (error) {
    console.error(error);
  }
});

router.put("/events/:id", (_req: Request, res: Response) => {
  try {
    res.send("Events put route");
  } catch (error) {
    console.error(error);
  }
});

router.delete("/events/:id", (_req: Request, res: Response) => {
  try {
    res.send("Events delete route");
  } catch (error) {
    console.error(error);
  }
});

router.get("/events/:id", (_req: Request, res: Response) => {
  try {
    res.send("Get one event route");
  } catch (error) {
    console.error(error);
  }
});

export default router;
