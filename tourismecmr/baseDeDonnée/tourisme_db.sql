--
-- PostgreSQL database dump
--

\restrict Dmwj9CAa8xcEDOVDSRClhYGT1m7V7oTcDXKmwJZQNUOheFvHtJTEEa7XpSJkl8p

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-07-04 04:53:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 24791)
-- Name: adminconnexion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adminconnexion (
    id_admin integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    mot_de_passe character varying(255) NOT NULL
);


ALTER TABLE public.adminconnexion OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24790)
-- Name: adminconnexion_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adminconnexion_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adminconnexion_id_admin_seq OWNER TO postgres;

--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 229
-- Name: adminconnexion_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adminconnexion_id_admin_seq OWNED BY public.adminconnexion.id_admin;


--
-- TOC entry 220 (class 1259 OID 24703)
-- Name: annonce; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annonce (
    id_annonce integer NOT NULL,
    id_prestataire integer NOT NULL,
    titre character varying(255) NOT NULL,
    description text NOT NULL,
    categorie character varying(50) NOT NULL,
    region character varying(50) NOT NULL,
    prix_unitaire numeric(12,2) NOT NULL,
    image_principale_url character varying(2048),
    site_touristique_id integer,
    CONSTRAINT annonce_categorie_check CHECK (((categorie)::text = ANY ((ARRAY['Hébergement'::character varying, 'Restaurant'::character varying, 'Articles'::character varying, 'Maisons'::character varying, 'Voitures'::character varying, 'Bar'::character varying, 'Événement'::character varying, 'Événementiel'::character varying, 'Autres'::character varying])::text[])))
);


ALTER TABLE public.annonce OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24702)
-- Name: annonce_id_annonce_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annonce_id_annonce_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.annonce_id_annonce_seq OWNER TO postgres;

--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 219
-- Name: annonce_id_annonce_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annonce_id_annonce_seq OWNED BY public.annonce.id_annonce;


--
-- TOC entry 226 (class 1259 OID 24754)
-- Name: avis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avis (
    id_avis integer NOT NULL,
    id_annonce integer NOT NULL,
    id_touriste integer NOT NULL,
    note integer NOT NULL,
    commentaire_texte text NOT NULL,
    CONSTRAINT avis_note_check CHECK (((note >= 1) AND (note <= 5)))
);


ALTER TABLE public.avis OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24753)
-- Name: avis_id_avis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_id_avis_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_id_avis_seq OWNER TO postgres;

--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 225
-- Name: avis_id_avis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avis_id_avis_seq OWNED BY public.avis.id_avis;


--
-- TOC entry 222 (class 1259 OID 24718)
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id_reservation integer NOT NULL,
    id_touriste integer NOT NULL,
    id_annonce integer NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    statut character varying(30) DEFAULT 'en_attente'::character varying,
    montant_total numeric(12,2) NOT NULL,
    CONSTRAINT reservation_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'confirmee'::character varying, 'annulee'::character varying])::text[])))
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24717)
-- Name: reservation_id_reservation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_id_reservation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservation_id_reservation_seq OWNER TO postgres;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 221
-- Name: reservation_id_reservation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_id_reservation_seq OWNED BY public.reservation.id_reservation;


--
-- TOC entry 228 (class 1259 OID 24775)
-- Name: site_touristique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_touristique (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    description text NOT NULL,
    region character varying(100) NOT NULL,
    ville character varying(100) NOT NULL,
    categorie character varying(100) NOT NULL,
    image_url text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.site_touristique OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24774)
-- Name: site_touristique_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_touristique_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_touristique_id_seq OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 227
-- Name: site_touristique_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_touristique_id_seq OWNED BY public.site_touristique.id;


--
-- TOC entry 224 (class 1259 OID 24737)
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    id_transaction integer NOT NULL,
    id_reservation integer NOT NULL,
    methode_paiement character varying(30) NOT NULL,
    reference_passerelle character varying(255) NOT NULL,
    montant_paye numeric(12,2) NOT NULL,
    commission_plateforme numeric(12,2) NOT NULL,
    statut character varying(30) DEFAULT 'en_attente'::character varying,
    CONSTRAINT transaction_methode_paiement_check CHECK (((methode_paiement)::text = ANY ((ARRAY['ORANGE_MONEY'::character varying, 'STRIPE'::character varying])::text[]))),
    CONSTRAINT transaction_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'reussie'::character varying, 'echouee'::character varying])::text[])))
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24736)
-- Name: transaction_id_transaction_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_id_transaction_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 223
-- Name: transaction_id_transaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_id_transaction_seq OWNED BY public.transaction.id_transaction;


--
-- TOC entry 218 (class 1259 OID 24691)
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id_utilisateur integer NOT NULL,
    email character varying(150) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    numero_telephone character varying(30),
    role character varying(30) NOT NULL,
    nom character varying(100),
    prenom character varying(100),
    nom_entreprise character varying(150),
    CONSTRAINT utilisateur_role_check CHECK (((role)::text = ANY ((ARRAY['touriste'::character varying, 'guide'::character varying, 'prestataire_hebergement'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24690)
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 217
-- Name: utilisateur_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_utilisateur_seq OWNED BY public.utilisateur.id_utilisateur;


--
-- TOC entry 4680 (class 2604 OID 24794)
-- Name: adminconnexion id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminconnexion ALTER COLUMN id_admin SET DEFAULT nextval('public.adminconnexion_id_admin_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 24706)
-- Name: annonce id_annonce; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce ALTER COLUMN id_annonce SET DEFAULT nextval('public.annonce_id_annonce_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 24757)
-- Name: avis id_avis; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis ALTER COLUMN id_avis SET DEFAULT nextval('public.avis_id_avis_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 24721)
-- Name: reservation id_reservation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation ALTER COLUMN id_reservation SET DEFAULT nextval('public.reservation_id_reservation_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 24778)
-- Name: site_touristique id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_touristique ALTER COLUMN id SET DEFAULT nextval('public.site_touristique_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 24740)
-- Name: transaction id_transaction; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id_transaction SET DEFAULT nextval('public.transaction_id_transaction_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 24694)
-- Name: utilisateur id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateur_id_utilisateur_seq'::regclass);


--
-- TOC entry 4704 (class 2606 OID 24800)
-- Name: adminconnexion adminconnexion_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminconnexion
    ADD CONSTRAINT adminconnexion_email_key UNIQUE (email);


--
-- TOC entry 4706 (class 2606 OID 24798)
-- Name: adminconnexion adminconnexion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminconnexion
    ADD CONSTRAINT adminconnexion_pkey PRIMARY KEY (id_admin);


--
-- TOC entry 4692 (class 2606 OID 24711)
-- Name: annonce annonce_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_pkey PRIMARY KEY (id_annonce);


--
-- TOC entry 4700 (class 2606 OID 24763)
-- Name: avis avis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_pkey PRIMARY KEY (id_avis);


--
-- TOC entry 4694 (class 2606 OID 24725)
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id_reservation);


--
-- TOC entry 4702 (class 2606 OID 24783)
-- Name: site_touristique site_touristique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_touristique
    ADD CONSTRAINT site_touristique_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 24745)
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id_transaction);


--
-- TOC entry 4698 (class 2606 OID 24747)
-- Name: transaction transaction_reference_passerelle_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_reference_passerelle_key UNIQUE (reference_passerelle);


--
-- TOC entry 4688 (class 2606 OID 24701)
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- TOC entry 4690 (class 2606 OID 24699)
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_utilisateur);


--
-- TOC entry 4707 (class 2606 OID 24712)
-- Name: annonce annonce_id_prestataire_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_id_prestataire_fkey FOREIGN KEY (id_prestataire) REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 24784)
-- Name: annonce annonce_site_touristique_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_site_touristique_id_fkey FOREIGN KEY (site_touristique_id) REFERENCES public.site_touristique(id) ON DELETE CASCADE;


--
-- TOC entry 4712 (class 2606 OID 24764)
-- Name: avis avis_id_annonce_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_id_annonce_fkey FOREIGN KEY (id_annonce) REFERENCES public.annonce(id_annonce) ON DELETE CASCADE;


--
-- TOC entry 4713 (class 2606 OID 24769)
-- Name: avis avis_id_touriste_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_id_touriste_fkey FOREIGN KEY (id_touriste) REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 24731)
-- Name: reservation reservation_id_annonce_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_id_annonce_fkey FOREIGN KEY (id_annonce) REFERENCES public.annonce(id_annonce) ON DELETE CASCADE;


--
-- TOC entry 4710 (class 2606 OID 24726)
-- Name: reservation reservation_id_touriste_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_id_touriste_fkey FOREIGN KEY (id_touriste) REFERENCES public.utilisateur(id_utilisateur) ON DELETE CASCADE;


--
-- TOC entry 4711 (class 2606 OID 24748)
-- Name: transaction transaction_id_reservation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_id_reservation_fkey FOREIGN KEY (id_reservation) REFERENCES public.reservation(id_reservation) ON DELETE CASCADE;


-- Completed on 2026-07-04 04:53:18

--
-- PostgreSQL database dump complete
--

\unrestrict Dmwj9CAa8xcEDOVDSRClhYGT1m7V7oTcDXKmwJZQNUOheFvHtJTEEa7XpSJkl8p

