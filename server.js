const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

app.get('/place-options', async (req, res) => {
  const { data, error } = await supabase.from('storage_place').select('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.get('/arrival-options', async (req, res) => {
  const { data, error } = await supabase.from('partner_place').select('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.post('/delivery', async (req, res) => {
  const { name, phone, startValue, endValue, deliveryDate, count, twocount, indown, user_id } = req.body;

  const { data, error } = await supabase
    .from('delivery')
    .insert([{ name, phone, delivery_start: startValue, delivery_arrive: endValue, delivery_date: deliveryDate, under: count, over: twocount, price: indown, user_id }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/delivery-delete', async (req, res) => {
  const { re_num, user_id } = req.body;
  const { error } = await supabase
    .from('delivery')
    .delete()
    .eq('re_num', re_num)
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post('/my-delivery-list', async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from('delivery')
    .select('*')
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});



app.post('/storage', async (req, res) => {
  const { name, phone, email, startDate, endDate, selectValue, count, twocount, threecount, indown, reservation_country, user_id } = req.body;

  const { data, error } = await supabase
    .from('storage')
    .insert([{ name, phone, mail: email, storage_start_date: startDate, storage_end_date: endDate, location: selectValue, small: count, medium: twocount, large: threecount, price: indown, reservation_country: "Mobile", user_id }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/storage-delete', async (req, res) => {
  const { reservation_number, user_id } = req.body;

  const { error } = await supabase
    .from('storage')
    .delete()
    .eq('reservation_number', reservation_number)
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post('/my-storage-list', async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from('storage')
    .select('*')
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
