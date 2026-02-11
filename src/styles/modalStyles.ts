// 🌱 Healing Garden - Common Modal Styles

import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 100,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#F5EDD6',
    borderWidth: 2,
    borderColor: '#8B6F47',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  closeIcon: {
    width: 35,
    height: 35,
  },
  closeButtonText: {
    fontSize: 22,
    fontFamily: 'Gaegu-Bold',
    color: '#5D4037',
    marginTop: -2,
  },
});
