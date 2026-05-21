import Button from "../components/Buttons"; // Memakai 's' karena nama file Anda adalah Buttons.jsx
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Card from "../components/Card";
import ProductCard from "../components/ProductCard";
import Table from "../components/Table";

export default function Components() {
  const headers = ["No", "Nama Produk", "Kategori", "Harga", "Aksi"];

  const products = [
    {
      id: 1,
      name: "Laptop Asus",
      category: "Elektronik",
      price: "Rp 8.000.000",
    },
    {
      id: 2,
      name: "Sepatu Sport",
      category: "Fashion",
      price: "Rp 450.000",
    },
    {
      id: 3,
      name: "Jam Tangan",
      category: "Aksesoris",
      price: "Rp 799.000",
    },
  ];

  return (
    <>
      <Container className="bg-gray-200">
        <PageHeader title="Components" />
        <p className="mb-2">Ini halaman Components</p>

        {/* Baris Tombol Pertama */}
        <div className="mb-4 flex flex-wrap gap-3">
          <Button type="success">Simpan</Button>
          <Button type="danger">Hapus</Button>
          <Button type="warning">Cetak</Button>
        </div>

        {/* Baris Tombol Kedua */}
        <div className="mb-4 flex flex-wrap gap-3">
          <Button type="success">Simpan</Button>
          <Button type="danger">Hapus</Button>
        </div>

        {/* Baris Avatar */}
        <div className="mb-4 flex flex-wrap gap-3">
          <Avatar name="Budi" />
          <Avatar name="Siti" />
        </div>

        {/* Komponen Card */}
        <div className="mb-4">
          <Card>
            <h2 className="text-xl font-bold">Judul Card</h2>
            <p className="text-gray-600">Ini adalah isi dari card.</p>
          </Card>
        </div>

        {/* Komponen Product Card */}
        <div className="space-y-4 mb-4">
          <ProductCard
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            title="Sepatu Sport"
            category="Fashion"
            price="Rp 450.000"
            description="Sepatu sport modern dengan desain nyaman dan ringan untuk aktivitas sehari-hari."
          />

          <ProductCard
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
            title="Smartphone"
            category="Elektronik"
            price="Rp 4.500.000"
            description="Smartphone dengan performa cepat, kamera jernih, dan baterai tahan lama."
          />
        </div>

        {/* Komponen Table */}
        <Table headers={headers}>
          {products.map((product, index) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border px-4 py-3">{index + 1}</td>
              <td className="border px-4 py-3">{product.name}</td>
              <td className="border px-4 py-3">{product.category}</td>
              <td className="border px-4 py-3">{product.price}</td>
              <td className="border px-4 py-3">
                <button className="bg-blue-600 text-white px-3 py-1 rounded">
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Container>
      <Footer />
    </>
  );
}