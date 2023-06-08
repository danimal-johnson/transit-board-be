import { Router, Request, Response, NextFunction} from "express";

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('<h2>Welcome to the API portion of the tour!<h2>');
});

export default router;