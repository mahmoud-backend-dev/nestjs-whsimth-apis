import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/schema/category.schema';
import { Product } from 'src/products/schema/product.schema';

@Schema({
  id: false,
  versionKey: false,
})
export class MainSection extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  h1: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  h2: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  h3: {
    ar: string;
    en: string;
  };

  @Prop({
    type: String,
  })
  image: string;
}

@Schema({
  id: false,
  versionKey: false,
})
export class SectionOne extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  label: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  description: {
    ar: string;
    en: string;
  };
  @Prop({
    type: [{ type: Types.ObjectId, ref: Product.name, _id: false }],
  })
  products: Product[];
}

@Schema({
  id: false,
  versionKey: false,
})
export class SectionTwo extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  label: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  description: {
    ar: string;
    en: string;
  };
  @Prop({
    type: [String],
  })
  images: string[];
}

@Schema({
  id: false,
  versionKey: false,
})
export class SectionThree extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  label: {
    ar: string;
    en: string;
  };

  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  description: {
    ar: string;
    en: string;
  };
  @Prop({
    type: [{ type: Types.ObjectId, ref: Product.name, _id: false }],
  })
  products: Product[];
}

@Schema({
  id: false,
  versionKey: false,
})
export class SectionFour extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  label: {
    ar: string;
    en: string;
  };

  @Prop({
    type: [{ type: Types.ObjectId, ref: Category.name, _id: false }],
  })
  categories: Category[];
}

@Schema({
  id: false,
  versionKey: false,
})
export class SectionFive extends Document {
  @Prop({
    type: {
      ar: { type: String },
      en: { type: String },
      _id: false,
    },
  })
  label: {
    ar: string;
    en: string;
  };

  @Prop({
    type: [String],
  })
  images: string[];
}

@Schema({
  id: false,
  versionKey: false,
})
export class HomePage extends Document {
  @Prop({
    type: MainSection,
    _id: false,
  })
  mainSection: MainSection;

  @Prop({
    type: SectionOne,
    _id: false,
  })
  sectionOne: SectionOne;

  @Prop({
    type: SectionTwo,
    _id: false,
  })
  sectionTwo: SectionTwo;

  @Prop({
    type: SectionThree,
    _id: false,
  })
  sectionThree: SectionThree;

  @Prop({
    type: SectionFour,
    _id: false,
  })
  sectionFour: SectionFour;

  @Prop({
    type: SectionFive,
    _id: false,
  })
  sectionFive: SectionFive;
}

export const HomePageSchema = SchemaFactory.createForClass(HomePage);
