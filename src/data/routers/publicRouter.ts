import { Router, Request, Response, NextFunction} from "express";

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('<h2>Welcome to the API portion of the tour!<h2>');
});

router.get('/info', (req: Request, res: Response): void => {
  // Get the current time and convert it to Pacific time
  const now = new Date();
  const pacificTime = new Date(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));

  res.json({
    message: 'Metadata about the API will go here',
    localtime: pacificTime.toLocaleString()
  });
});


router.get('/routes', (req: Request, res: Response): void => {
  const routes = [{id: 1, shortName: 'Route 1'}, {id: 2, shortName: 'Route 2'}];
  res.json(routes);
});



export default router;