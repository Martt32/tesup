import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Contact() {
  return (
    <section className="relative py-32 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            Contact <span className="text-purple-400">TesUp</span>
          </h1>

          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Have questions about the platform, investments, or partnerships? Our
            team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: Mail,
                title: "Email",
                text: "noreply@tesup.ai",
              },
              {
                icon: Phone,
                title: "Phone",
                text: "+1 (000) 000-0000",
              },
              {
                icon: MapPin,
                title: "Headquarters",
                text: "Global Operations",
              },
            ].map((itemData, i) => {
              const Icon = itemData.icon;

              return (
                <motion.div key={i} variants={item} className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  <div className="relative flex items-center gap-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-purple-400/40 transition">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                      <Icon className="text-purple-400" size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold">{itemData.title}</h3>
                      <p className="text-white/60 text-sm">{itemData.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-xl opacity-70"></div>

            <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-400/50 transition"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-400/50 transition"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-400/50 transition"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-400/50 transition"
              />

              <button
                type="submit"
                className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-lg font-medium"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Background Glows */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full"
      />
    </section>
  );
}
