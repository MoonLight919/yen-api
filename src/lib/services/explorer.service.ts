import { type Module } from '@nestjs/core/injector/module';
import { type InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';

@Injectable()
export abstract class ExplorerService {
  constructor(protected readonly modulesContainer: ModulesContainer) {}
  protected flatMap<T>(
    modules: Module[],
    callback: (instance: InstanceWrapper) => T | undefined,
  ): T[] {
    const items = modules
      .map((module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), []);
    return items.filter((element) => !!element) as T[];
  }

  protected filterProvider<T>(
    wrapper: InstanceWrapper,
    metadataKey: Symbol,
  ): T | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  protected extractMetadata<T>(
    instance: Record<string, unknown>,
    metadataKey: Symbol,
  ): T | undefined {
    const instanceMetadata = Reflect.getMetadata(metadataKey, instance);
    if (instanceMetadata) {
      return instance as T;
    }
    if (!instance.constructor) {
      return;
    }
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
    return metadata ? (instance as T) : undefined;
  }

  public abstract explore(): unknown;
}
