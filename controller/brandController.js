const db = require('../connection/connection');

const addBrand = (req, res) => {
    const {name} = req.body;
    console.log(name)
    const sql = 'call inv.sp_add_brand(?,null);';
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      console.log('Brand inserted successfully');
      return res.status(200).json({ message: 'Brand inserted successfully' });
    });
};

const DeleteBrandById = (req, res) => {

  const { brand_id } = req.body;
  console.log(brand_id)
  const sql = 'call inv.sp_delete_brand(?);'
  db.query(sql,[brand_id], (err, result) => {
      if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Failed to Remove Brand' });
        }
        console.log('Brand Removed successfully');
        return res.status(200).json({ message: 'Brand Removed successfully' });
      });  
};

const GetAllBrands = (req, res) => {
    const sql = 'SELECT * FROM inv.brands';
    db.query(sql, (err, result) => {
      return res.json(result);
    });
  };

  module.exports = {
    addBrand,
    GetAllBrands,
    DeleteBrandById,
  };