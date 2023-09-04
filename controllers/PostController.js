import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить все статьи (const getAll)',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить все статьи (const getAll)',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: { viewsCount: 1 }
      },
      {
        returnDocument: 'after'
      })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json(
            {
              message: 'Статья не найдена',
            });
        };

        res.json(doc)
      }).catch((err) => {
        if (err) {
          return res.status(403).json(
            {
              message: 'Не удалось получить пост',
            });
        };
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить все статью (const getOne)',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json(
          {
            message: 'Статья не найдена',
          });
      }

      res.json({
        message: 'Статья успешно удалена',
      });
    }).catch((error) => {
      return res.status(404).json({
        message: 'Не удалось удалить статью',
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить все статью (const getOne)',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    res.json({
      message: 'Статья успешно обновлена!!!',
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить статью :(',
    });
  }
};