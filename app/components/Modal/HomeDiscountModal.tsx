import { motion } from "framer-motion";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";
import { FC } from "react";

interface Discount {
  code: string;
  discount_value: number;
  is_percentage: boolean;
  min_order_value: number;
}

interface DiscountProps {
  discounts: Discount[];
  handleCopyCode: (code: string) => void;
}

interface CommonModalProps extends DiscountProps {
  isLoggedIn: boolean;
}

interface MainModalProps extends CommonModalProps {
  modalType: "regular" | "exit-intent" | "cart";
  dismissModal: (hours: number) => void;
}

// Logged-in content
export const LoggedInDiscountContent: FC<DiscountProps> = ({
  discounts,
  handleCopyCode,
}) => (
  <>
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="relative z-10"
    >
      <div className="bg-tertiary/10 p-2 inline-block rounded-full mb-2">
        <MdLocalOffer className="text-3xl text-tertiary" />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4">
        Sizin İçin Aktif İndirimler
      </h3>
    </motion.div>

    <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 custom-scrollbar relative z-10">
      {discounts.length > 0 ? (
        discounts.map((d, index) => (
          <motion.div
            key={d.code}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative overflow-hidden group"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-secondary/10 rounded-full p-2 mr-3">
                  <span className="text-secondary font-bold">
                    {d.is_percentage
                      ? `%${d.discount_value}`
                      : `${d.discount_value}₺`}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-left">
                    {d.is_percentage
                      ? `%${d.discount_value} İndirim`
                      : `${d.discount_value}₺ İndirim`}
                  </h4>
                  <p className="text-xs text-gray-500 text-left">
                    Min. ₺{d.min_order_value} alışveriş
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 border-dashed flex-1 mr-2">
                  <code className="text-gray-700 font-mono tracking-wider">
                    {d.code}
                  </code>
                </div>
                <button
                  onClick={() => handleCopyCode(d.code)}
                  className="bg-secondary hover:bg-tertiary text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Kopyala
                </button>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-tertiary/5 rounded-full transform translate-x-1/4 translate-y-1/4" />
          </motion.div>
        ))
      ) : (
        <p className="text-gray-600 text-center py-6">
          Şu an aktif bir indirim bulunmamaktadır.
        </p>
      )}
    </div>
  </>
);

// Guest content
export const GuestDiscountContent: FC = () => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="relative z-10"
  >
    <MdLocalOffer className="text-5xl text-secondary mx-auto mb-2" />
    <h3 className="text-2xl font-bold text-primary mb-4">
      İndirimleri Kaçırmayın!
    </h3>
    <p className="text-gray-700 my-4 leading-relaxed">
      Özel indirimlerimizden ve kampanyalarımızdan haberdar olmak için hemen üye
      olun veya giriş yapın.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
      <Link href="/giris">
        <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
          Giriş Yap
        </button>
      </Link>
      <Link href="/uye-ol">
        <button className="bg-white hover:bg-gray-100 text-secondary border border-secondary px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
          Üye Ol
        </button>
      </Link>
    </div>
  </motion.div>
);

// Exit intent content
export const ExitIntentContent: FC<CommonModalProps> = ({
  isLoggedIn,
  discounts,
  handleCopyCode,
}) => (
  <>
    <div className="bg-tertiary/10 p-2 inline-block rounded-full mb-2">
      <MdLocalOffer className="text-4xl text-tertiary" />
    </div>
    <h3 className="text-2xl font-bold text-primary mb-3">
      Gitmeyin! Size Özel Fırsat
    </h3>

    {isLoggedIn ? (
      <>
        <p className="text-gray-700 mb-4">
          Alışverişinizi tamamlamadan gitmeyin. Size özel indirimlerimizi
          değerlendirin!
        </p>
        {discounts.length > 0 ? (
          <div className="mt-4 space-y-3">
            <p className="font-medium">En Avantajlı İndirim Kodunuz:</p>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 border-dashed">
              <code className="text-gray-700 font-mono tracking-wider text-lg">
                {discounts[0].code}
              </code>
            </div>
            <button
              onClick={() => handleCopyCode(discounts[0].code)}
              className="bg-secondary hover:bg-tertiary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 mt-2"
            >
              Kodu Kopyala ve Kullan
            </button>
          </div>
        ) : (
          <p>İndirim kodları yükleniyor...</p>
        )}
      </>
    ) : (
      <>
        <p className="text-gray-700 mb-4">
          Gitmeden önce üye olun ve özel indirimlerimizden yararlanın!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          <Link href="/giris">
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto">
              Giriş Yap
            </button>
          </Link>
          <Link href="/uye-ol">
            <button className="bg-white hover:bg-gray-100 text-secondary border border-secondary px-6 py-2 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto">
              Üye Ol
            </button>
          </Link>
        </div>
      </>
    )}
  </>
);

// Cart abandonment
export const CartAbandonmentContent: FC<CommonModalProps> = ({
  isLoggedIn,
  discounts,
  handleCopyCode,
}) => (
  <>
    <div className="bg-tertiary/10 p-2 inline-block rounded-full mb-2">
      <MdLocalOffer className="text-4xl text-tertiary" />
    </div>
    <h3 className="text-2xl font-bold text-primary mb-3">
      Sepetinizi Tamamlayın!
    </h3>

    {isLoggedIn ? (
      <>
        <p className="text-gray-700 mb-4">
          Sepetinizdeki ürünler için size özel indirim fırsatlarımız var!
        </p>
        {discounts.length > 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
            <p className="font-medium text-gray-800 mb-2">
              En Avantajlı İndirim:
            </p>
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/10 rounded-full p-2">
                <span className="text-secondary font-bold">
                  {discounts[0].is_percentage
                    ? `%${discounts[0].discount_value}`
                    : `${discounts[0].discount_value}₺`}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {discounts[0].is_percentage
                  ? `%${discounts[0].discount_value} indirim`
                  : `${discounts[0].discount_value}₺ indirim`}
                <span className="block text-xs">
                  Min. ₺{discounts[0].min_order_value} alışveriş
                </span>
              </p>
            </div>
            <div className="flex items-center mt-3 bg-white px-3 py-2 rounded border border-gray-200 border-dashed justify-between">
              <code className="text-gray-700 font-mono">
                {discounts[0].code}
              </code>
              <button
                onClick={() => handleCopyCode(discounts[0].code)}
                className="text-secondary hover:text-tertiary text-sm font-medium ml-2"
              >
                Kopyala
              </button>
            </div>
          </div>
        ) : (
          <p>İndirimler yükleniyor...</p>
        )}
        <Link href="/sepet">
          <button className="bg-secondary hover:bg-tertiary text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 mt-2 w-full">
            Sepetime Git
          </button>
        </Link>
      </>
    ) : (
      <>
        <p className="text-gray-700 mb-4">
          Sepetinizdeki ürünler sizi bekliyor! Üye olun ve özel indirimlerden
          yararlanın.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          <Link href="/giris">
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto">
              Giriş Yap
            </button>
          </Link>
          <Link href="/sepet">
            <button className="bg-white hover:bg-gray-100 text-secondary border border-secondary px-6 py-2 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto">
              Sepetime Git
            </button>
          </Link>
        </div>
      </>
    )}
  </>
);

// Main modal
export const HomeDiscountModal: FC<MainModalProps> = ({
  modalType,
  discounts,
  isLoggedIn,
  dismissModal,
  handleCopyCode,
}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full relative overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary/20 rounded-full z-0" />

        {modalType === "exit-intent" ? (
          <ExitIntentContent
            isLoggedIn={isLoggedIn}
            discounts={discounts}
            handleCopyCode={handleCopyCode}
          />
        ) : modalType === "cart" ? (
          <CartAbandonmentContent
            isLoggedIn={isLoggedIn}
            discounts={discounts}
            handleCopyCode={handleCopyCode}
          />
        ) : isLoggedIn ? (
          <LoggedInDiscountContent
            discounts={discounts}
            handleCopyCode={handleCopyCode}
          />
        ) : (
          <GuestDiscountContent />
        )}

        <button
          onClick={() => dismissModal(24)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full transition-colors duration-300 z-20"
          aria-label="Kapat"
        >
          <IoClose size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
};
