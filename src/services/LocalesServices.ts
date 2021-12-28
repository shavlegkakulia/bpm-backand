
import { LocalesCRUID } from "../implementations/LocalesCRUID";
import Locales from './../models/localeModel';

class LocalesServices implements LocalesCRUID {
  locales = async () => {
    return Locales.findAll();
  };
}

export default new LocalesServices();
