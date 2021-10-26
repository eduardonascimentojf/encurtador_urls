import { Request, Response } from 'express';
import shortId from 'shortid';
import { URLModel } from '../database/model/URL';

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void> {
    const { originURL } = req.body;
    const url = await URLModel.findOne({ originURL });
    if (url) {
      res.json({
        message: `Ja existe um encurtador criado para: ${originURL}`,
        url,
        shortURL: url.shortURL,
      });
      return;
    }
    const hash = shortId.generate();
    const shortURL = `${process.env.API_URL}/${hash}`;
    const newURL = await URLModel.create({ hash, shortURL, originURL });
    res.json({
      message: `Criado um encurtador de url para: ${originURL}`,
      newURL,
      shortURL: newURL.shortURL,
    });
  }

  public async redirect(req: Request, res: Response): Promise<void> {
    const { hash } = req.params;
    const url = await URLModel.findOne({ hash });

    if (url) {
      res.redirect(url.originURL);
      return;
    }

    res.status(400).json({ error: 'URL não encontrada.' });
  }
}
